# net_sock_info.rb
Facter.add(:net_sock_info) do
  confine :kernel => "Darwin"
  setcode do
    Facter::Util::Resolution.exec("lsof -i | grep ESTABLISHED | awk -v OFS='\t' '{print $1, $2}'")
  end
end
